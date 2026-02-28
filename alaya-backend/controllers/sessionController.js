const Session = require("../models/session");

exports.addSession = async (req, res) => {
  try {
    const { userId, date, type, durationMinutes } = req.body;

    if (!userId || !type || !durationMinutes) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing fields: userId, type, and durationMinutes are required." 
      });
    }

    const newSession = await Session.create({ 
      userId, 
      date: date || new Date().toISOString().split('T')[0],
      type, 
      durationMinutes: parseInt(durationMinutes)
    });

    res.status(201).json({ 
      success: true, 
      message: "Session logged in Alaya Sanctuary!",
      data: newSession 
    });
  } catch (error) {
    console.error("Add Session Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.findAll({ 
      where: { userId }, 
      order: [['date', 'DESC']] 
    });

    res.status(200).json({ 
      success: true, 
      data: sessions 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};