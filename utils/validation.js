function validateInput({ name, address, latitude, longitude }) {
    const isStringValid = str => typeof str === 'string' && str.trim() !== '';
    const isLatValid = num => typeof num === 'number' && num >= -90 && num <= 90;
    const isLonValid = num => typeof num === 'number' && num >= -180 && num <= 180;

    if (!isStringValid(name)) return { valid: false, message: 'Invalid or missing "name". It should be a non-empty string.' };
    if (!isStringValid(address)) return { valid: false, message: 'Invalid or missing "address". It should be a non-empty string.' };
    if (!isLatValid(latitude)) return { valid: false, message: 'Invalid "latitude". It should be a number between -90 and 90.' };
    if (!isLonValid(longitude)) return { valid: false, message: 'Invalid "longitude". It should be a number between -180 and 180.' };

    return { valid: true };
}

module.exports = validateInput;
