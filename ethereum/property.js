import web3 from "./web3";
import Rent from './build/Rent.json';

export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(Rent.interface),
        address
    );
};