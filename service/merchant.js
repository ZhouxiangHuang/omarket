// import regeneratorRuntime from '../../libs/runtime';
const http = require('http.js');

const getDetail = id => {
    return http.promiseGet('/site/merchant/detail', {
        merchant_id: id
    });
}

module.exports = {
    getDetail: getDetail,
}