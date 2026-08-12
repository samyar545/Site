function successResponse(data, message = 'Success') {
  return { success: true, message, data };
}

function errorResponse(error, message = 'Error') {
  return { success: false, message, error };
}

module.exports = { successResponse, errorResponse };
