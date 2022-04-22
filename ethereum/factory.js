import web3 from './web3';
import FactoryRent from './build/FactoryRent.json';

const instance = new web3.eth.Contract(
    JSON.parse(FactoryRent.interface),
    '0xc2666344f9357eF2fEcF912751e212cD7d3A206f'
);

export default instance;