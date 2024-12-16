const cleanAndParseBody = (req, res, next) => {
    try {
      // Trim leading and trailing spaces for all string fields
      console.log(req.body)
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim().replace(/,$/, ''); // Remove trailing commas
        }
      }
  
      // Parse sizes and colors if they are stringified JSON
      if (req.body.sizes) req.body.sizes = JSON.parse(req.body.sizes);
      if (req.body.colors) req.body.colors = JSON.parse(req.body.colors);
  
      // Parse numerical values
      req.body.mrp_price = parseFloat(req.body.mrp_price);
      req.body.selling_price = parseFloat(req.body.selling_price);
      req.body.stock = parseInt(req.body.stock, 10);
  
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input format. Please check your request data.',
      });
    }
  };

  export default cleanAndParseBody;