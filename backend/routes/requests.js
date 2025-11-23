const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Request = require('../models/Request');
const cache = require('../utils/cache');

module.exports = (io) => {
  // POST /request
  router.post('/', async (req, res) => {
    const { name, phone, title, image } = req.body;
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Request title is required' });
    }

    try {
      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
          error: 'Database not connected', 
          message: 'MongoDB connection is not available. Please check your database connection.' 
        });
      }

      const timestamp = new Date();
      const newRequest = new Request({ 
        name: name.trim(), 
        phone: phone.trim(), 
        title: title.trim(), 
        image: image || '', 
        timestamp 
      });
      await newRequest.save();
      
      // Clear cache on new request
      cache.clear();
      
      // Emit Socket.IO event
      if (io) {
        io.emit('newRequest', newRequest);
      }
      
      console.log('✅ New request created:', newRequest._id);
      res.status(201).json(newRequest);
    } catch (err) {
      console.error('❌ Error creating request:', err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: err.message });
      }
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // GET /requests
  router.get('/', async (req, res) => {
    try {
      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
          error: 'Database not connected', 
          message: 'MongoDB connection is not available. Please check your database connection.',
          requests: [] 
        });
      }

      const cacheKey = 'all_requests';
      const cached = cache.get(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }
      
      const requests = await Request.find().sort({ timestamp: -1 });
      cache.set(cacheKey, requests);
      res.json(requests);
    } catch (err) {
      console.error('❌ Error fetching requests:', err);
      res.status(500).json({ error: 'Server error', details: err.message, requests: [] });
    }
  });

  // GET /requests/sorted
  router.get('/sorted', async (req, res) => {
    try {
      const order = req.query.order || 'asc'; // 'asc' or 'desc'
      const sortOrder = order === 'desc' ? -1 : 1;
      
      const cacheKey = `sorted_requests_${order}`;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }
      
      const requests = await Request.find().sort({ title: sortOrder });
      cache.set(cacheKey, requests);
      res.json(requests);
    } catch (err) {
      console.error('Error fetching sorted requests:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // GET /requests/search
  router.get('/search', async (req, res) => {
    const { title } = req.query;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Search title is required' });
    }
    
    try {
      const cacheKey = `search_${title.trim().toLowerCase()}`;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }
      
      const requests = await Request.find({ 
        title: { $regex: title.trim(), $options: 'i' } 
      }).sort({ timestamp: -1 });
      
      cache.set(cacheKey, requests);
      res.json(requests);
    } catch (err) {
      console.error('Error searching requests:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // DELETE /request/:id
  router.delete('/:id', async (req, res) => {
    try {
      const request = await Request.findByIdAndDelete(req.params.id);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      // Clear cache on delete
      cache.clear();
      
      // Emit Socket.IO event
      if (io) {
        io.emit('requestDeleted', req.params.id);
      }
      
      res.json({ message: 'Deleted successfully', id: req.params.id });
    } catch (err) {
      console.error('Error deleting request:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  return router;
};
