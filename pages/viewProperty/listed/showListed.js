import React,{Component} from 'react';
import Layout from '../../../components/Layout';
import Rent from '../../../ethereum/property';
import factory from '../../../ethereum/factory';
import web3 from '../../../ethereum/web3';
import {Link} from '../../../routes'
import { Card, Button,Statistic } from "semantic-ui-react";
class RentShowListed extends Component
{
    state = { userAddress: ""}
    
    static async getInitialProps(props)
    {
        const accounts = await web3.eth.getAccounts();
        const userAddress= accounts[0];
        const propertyAddresses= await factory.methods.getManagerContracts(userAddress).call();
        const promiseArray = propertyAddresses.map(async (address) => {
            const rent = Rent(address);
            const summary = await rent.methods.RentSummary().call();
            return {
                keys: "values",
                addr: address,
                name: summary[6],
                description: summary[3],
                availability: summary[2],
                location: summary[8]
            };                                    
        });
        const finalresults = await Promise.all(promiseArray);
        console.log(finalresults);
        return { finalresults };
    }
    renderRentContracts() {
        const items = this.props.finalresults.map((result) => {
            let check = result.availability;
            return {
                header: result.name,
                meta: result.location,
                description: (
                    <div>
                        {result.description}
                        <br></br><br></br> 
                    </div>
                ),
                extra: (
                    <Link route={`/properties/${result.addr}`}>
                        <a style={{ color: 'blue' }}>View property details</a>
                    </Link>
                ),
                fluid: true,
            };
        });
        return <Card.Group style={{marginLeft:'20%',marginRight:'20%'}} items={items} />;
    }
    
    render()
    {
        return(<Layout>
            <h1>hello</h1>
            {this.renderRentContracts()}
        </Layout>);
    }
}

export default RentShowListed;