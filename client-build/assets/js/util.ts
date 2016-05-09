"use strict";
function normalizePhoneNumber(phonenumber) {
    if (phonenumber) {
        // Normalize to the form 999-999-9999
        var digitsOnly = "";
        for (var i = 0; i < phonenumber.length; ++i)
            if (phonenumber.charAt(i) >= '0' && phonenumber.charAt(i) <= '9')
                digitsOnly += phonenumber[i];
        if (digitsOnly.length != 10)
            return phonenumber; // Leave things untouched
        else
            return digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3, 6) + '-' + digitsOnly.slice(6);
    }
}
exports.normalizePhoneNumber = normalizePhoneNumber;
;
//# sourceMappingURL=util.js.map