// backend/src/controllers/push.controller.js
import admin from "../services/firebase.js"
import { DeviceToken } from "../models/DeviceToken.model.js";

/** Save / update a device token */
const saveToken = async (req, res) => {
  try {
    console.log("📥 saveToken hit with body:", req.body);
    const { token, platform = 'android', meta, userId } = req.body;

    if (!token) return res.status(400).json({ error: 'token is required' });

    // upsert by token
    const doc = await DeviceToken.findOneAndUpdate(
      { token },
      { user: userId || undefined, platform, meta, lastSeenAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ ok: true, tokenId: doc._id });
  } catch (e) {
    console.error('saveToken error', e);
    return res.status(500).json({ error: 'internal_error' });
  }
};

/** Helper: chunk array (FCM sendMulticast limit = 500) */
function chunk(arr, size = 500) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Broadcast to ALL stored tokens */
const notifyAll = async (req, res) => {
  try {
    const { title, body, image, data } = req.body;
    if (!title || !body) return res.status(400).json({ error: "title and body are required" });

    const tokensDocs = await DeviceToken.find({}, { token: 1 }).lean();
    const tokens = tokensDocs.map((d) => d.token);
    if (!tokens.length) return res.json({ ok: true, sent: 0, message: "no tokens" });

    const batches = chunk(tokens, 500);
    let successCount = 0,
      failureCount = 0,
      toDelete = [];

    const results = await Promise.allSettled(
      batches.map((batch) => {
        const message = {
          notification: {
            title,
            body,
            ...(image ? { image } : {}),
          },
          data: data
            ? Object.fromEntries(Object.entries(data).map(([k, v]) => [String(k), String(v)]))
            : {},
          tokens: batch,
          android: {
            priority: "high",
            notification: {
              sound: "default",
              channelId: "default-channel-id", // ✅ match app
            },
          },
        };
        return admin.messaging().sendEachForMulticast(message);
      })
    );

    results.forEach((r, batchIndex) => {
      if (r.status === "fulfilled") {
        successCount += r.value.successCount;
        failureCount += r.value.failureCount;

        r.value.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const code = resp.error?.code;
            if (
              ["messaging/registration-token-not-registered", "messaging/invalid-registration-token"].includes(code)
            ) {
              toDelete.push(batches[batchIndex][idx]); // ✅ delete the token itself
            }
          }
        });
      } else {
        console.error("Batch failed", r.reason);
      }
    });

    if (toDelete.length) {
      await DeviceToken.deleteMany({ token: { $in: toDelete } });
    }

    return res.json({ ok: true, successCount, failureCount, removedInvalid: toDelete.length });
  } catch (e) {
    console.error("notifyAll error", e);
    return res.status(500).json({ error: "internal_error" });
  }
};



/** Targeted send (optional) */
const notifyUsers = async (req, res) => {
  try {
    const { userIds = [], title, body, image, data } = req.body;
    if (!userIds.length || !title || !body) {
      return res.status(400).json({ error: 'userIds[], title, body required' });
    }

    const tokensDocs = await DeviceToken.find({ user: { $in: userIds } }, { token: 1 }).lean();
    const tokens = tokensDocs.map(d => d.token);
    if (!tokens.length) return res.json({ ok: true, sent: 0, message: 'no tokens for users' });

    const resp = await admin.messaging().sendMulticast({
      notification: { title, body, ...(image ? { image } : {}) },
      data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [String(k), String(v)])) : {},
      tokens,
      android: { priority: 'high', notification: { sound: 'default', channelId: 'default' } },
    });

    return res.json({ ok: true, successCount: resp.successCount, failureCount: resp.failureCount });
  } catch (e) {
    console.error('notifyUsers error', e);
    return res.status(500).json({ error: 'internal_error' });
  }
};

export {
    saveToken,
    notifyAll,
    notifyUsers,
}
