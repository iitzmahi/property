import web3 from './web3';
import FactoryRent from './build/FactoryRent.json';

const instance = new web3.eth.Contract(
    JSON.parse(FactoryRent.interface),
    '0xEE9C27f1b0759Afaf35E9c5eBb6550Afc33112DC'
);

export default instance;