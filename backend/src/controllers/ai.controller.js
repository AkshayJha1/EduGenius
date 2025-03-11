const {generateAImessage} = require('../services/geminiAi.services.');

const aIMessage = async (req, res) => {
    try {
        const { chat } = req.body;

        if (!chat) return res.status(400).json({ message: "prompt not found" });

        const result = await generateAImessage(chat);  // Ensure it's awaited if it's async
        res.status(200).json({ result });
    } catch (error) {
        console.error("Error in AI message:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { aIMessage };
