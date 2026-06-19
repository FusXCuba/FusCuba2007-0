const express = require('express');
const Contact = require('../models/Contact');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all contacts
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.userId })
      .populate('contact', 'username email avatar status isOnline lastSeen')
      .sort({ lastMessageTime: -1 });

    res.json({
      success: true,
      contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add contact
router.post('/add', auth, async (req, res) => {
  try {
    const { contactId } = req.body;

    if (req.userId.toString() === contactId) {
      return res.status(400).json({
        success: false,
        message: 'Нельзя добавить себя в контакты'
      });
    }

    let contact = await Contact.findOne({ user: req.userId, contact: contactId });
    if (contact) {
      return res.status(400).json({
        success: false,
        message: 'Контакт уже добавлен'
      });
    }

    contact = new Contact({
      user: req.userId,
      contact: contactId
    });

    await contact.save();
    await contact.populate('contact', 'username email avatar');

    res.status(201).json({
      success: true,
      message: 'Контакт добавлен',
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Remove contact
router.delete('/:contactId', auth, async (req, res) => {
  try {
    await Contact.findOneAndDelete({
      user: req.userId,
      contact: req.params.contactId
    });

    res.json({
      success: true,
      message: 'Контакт удален'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Block contact
router.put('/:contactId/block', auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { user: req.userId, contact: req.params.contactId },
      { isBlocked: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Контакт не найден'
      });
    }

    res.json({
      success: true,
      message: 'Контакт заблокирован',
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add to favorites
router.put('/:contactId/favorite', auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { user: req.userId, contact: req.params.contactId },
      { isFavorite: req.body.isFavorite },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Контакт не найден'
      });
    }

    res.json({
      success: true,
      message: req.body.isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного',
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
