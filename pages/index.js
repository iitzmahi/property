import React, { Component } from "react";
import { Card, Button,Statistic } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link, Router } from '../routes'
import Rent from '../ethereum/property';

class RentIndex extends Component {
    static async getInitialProps() {
        const rentContracts = await factory.methods.getDeployedRentContract().call();
        const promiseArray = rentContracts.map(async (address) => {
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
    giveAvailability(check) {
        if (check==1) {
            return "Available";
        }
        else {
            return "Unavailable";
        }
    }
    getColor(check) {
        if (check == 1) {
            return "green";
        }
        else {
            return "red";
        }
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
                        <div style={{ color: this.getColor(check), fontSize: '13px' }}>
                        {this.giveAvailability(check)}
                        </div>
                        
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
    render() {
        return (
            <Layout>
                <div>
                    <br/>
                    <h3>Properties listed</h3>

                    <Link route="/properties/new">
                        <Button floated="right" content="Post your property" icon="add circle" color="red" style={{marginRight:'10%'}}/>
                    </Link>
                    {this.renderRentContracts()}
                </div>
                <Statistic style={{marginLeft:'45%',marginTop:'60px'}} color='green' inverted>
                    <Statistic.Value>{this.props.finalresults.length}</Statistic.Value>
                    <Statistic.Label>Properties Listed So Far</Statistic.Label>
                </Statistic>
            </Layout>
        );
    }
}

export default RentIndex;

