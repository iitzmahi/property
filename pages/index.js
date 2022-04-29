import React, { Component } from "react";
import { Card, Button,Statistic, Input } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link, Router } from '../routes';
import Rent from '../ethereum/property';

class RentIndex extends Component {
    state={
        search:''
    };
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
        let items = this.props.finalresults.map((result) => {
            let check = result.availability;
            if(result.availability==1 && this.state.search==result.location)
            {
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
            }
        });
        const items1 = items.filter(e => e != null);
        console.log(items1);
        return <Card.Group style={{marginLeft:'20%',marginRight:'20%'}} items={items1} />;
    }
    render() {
        return (
            <Layout>
                <div>
                    <br/>
                    <Link route="/viewProperty/showProperty">
                    <Button positive style={{marginLeft:'20.5%'}} content='View Your Listed/Rented Properties'></Button>
                    </Link>
                    <div style={{marginLeft:'41.5%'}} class="ui action input">
                    <Input
                     placeholder="enter city name"
                        value={this.state.search}
                        onChange={event=>this.setState({search:event.target.value})}
                    type="text"/>
                    <Button positive class="ui button">Search</Button>
                    </div>
                    <h1 style={{color:'cyan',marginLeft:'20.5%',marginBottom:'20px'}}>Listed Properties</h1>

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

