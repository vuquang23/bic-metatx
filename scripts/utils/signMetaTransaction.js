const ethUtils = require("ethereumjs-util");
const sigUtil = require("eth-sig-util");

const signMetaTransaction = async (dataToSign, privateKey) => {
    const signature = sigUtil.signTypedData(ethUtils.toBuffer('0x' + privateKey), {
        data: dataToSign,
    })
    let r = signature.slice(0, 66);
    let s = "0x".concat(signature.slice(66, 130));
    let v = "0x".concat(signature.slice(130, 132));
    v = parseInt(v);
    if (![27, 28].includes(v)) v += 27;

    return {
        r,
        s,
        v
    }
}

module.exports = {
    signMetaTransaction
};
