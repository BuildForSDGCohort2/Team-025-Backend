const Hospital = require('../models/hospital');

exports.one = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findOne({ _id: id });
    if (!hospital) {
      return res.status(401).json({
        status: 'error',
        message: 'no hospital in this local government',
        data: []
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'hospital record gotten successfully',
      data: hospital
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

exports.byLg = async (req, res) => {
  try {
    const { lg } = req.params;
    const hospitals = await Hospital.find({ lg });
    if (!hospitals) {
      return res.status(401).json({
        status: 'error',
        message: 'no hospital in this local government',
        data: []
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'hospital record gotten successfully',
      data: hospitals
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

exports.all = async (req, res) => {
  try {
    const hospital = await Hospital.find();
    if (!hospital) {
      return res.status(401).json({
        status: 'error',
        message: 'no hospital in this local government',
        data: []
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'All hospital record gotten successfully',
      data: hospital
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};
