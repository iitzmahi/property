import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Rent from '../../ethereum/property';
import { Button, Card, Grid, Message } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

class RentShow extends Component {
    state = { user: -1, isLessee: true, userAddress: "", errorMessage: "", visibility: "1" }
    static async getInitialProps(props) { //this props is different than that in render
        const rentContract = Rent(props.query.address);
        const summary = await rentContract.methods.RentSummary().call();
        const lessee = await rentContract.methods.getCurrentLessee().call();
        // console.log(address);
        // console.log(summary);
        return {
            manager: summary[0],
            security: summary[1],
            availability: summary[2],
            description: summary[3],
            rating: summary[4],
            rentPerMonth: summary[5],
            name: summary[6],
            lateRentCharges: summary[7],
            location: summary[8],
            address: props.query.address,
            lessee: lessee
        };
    }
    renderCards() {
        const {
            security,
            availability,
            description,
            rating,
            manager,
            rentPerMonth,
            name,
            lateRentCharges,
            location
        } = this.props;
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager posted this property.',
                style: { overflowWrap: 'break-word' },
                color: 'red'
            },
            {
                header: security,
                meta: 'Minimum security (wei)',
                description: 'Lessee must pay this much to take property on lease.',
                style: { overflowWrap: 'break-word' },
                color: 'red'
            },
            {
                header: rentPerMonth,
                meta: 'Rent per month (wei)',
                description: 'Amount of rent to be paid by lesse per month.',
                style: { overflowWrap: 'break-word' },
                color: 'red'
            },
            {
                header: lateRentCharges,
                meta: 'Late rent charges (wei)',
                description: 'Charges per day if the lessee pays rent after due date.',
                style: { overflowWrap: 'break-word' },
                color: 'red'
            },
            {
                header: name,
                meta: 'Name',
                description: 'Name of the property.',
                style: { overflowWrap: 'break-word' },
                color: 'red'
            },
            {
                header: description,
                meta: 'Description',
                description: 'Description of the property.',
                style: { overflowWrap: 'break-word' },
                color: 'red'
            },
            {
                header: location,
                meta: 'Location',
                description: 'Location of the property.',
                style: { overflowWrap: 'break-word' },
                color: 'red'
            }
        ];
        return <Card.Group style={{marginLeft:'20%',marginRight:'20%'}} items={items} />;
    }
    componentDidMount() {
        this.typeOfUser();
    }
    typeOfUser = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({ userAddress: accounts[0] });
        this.setState({ isLessee: accounts[0] == this.props.lessee });
        if(accounts[0] == this.props.manager)
            this.setState({ user: 1 }); 
        else
            this.setState({ user: 0 }); 
    };
    // isOwner = async () =>
    // {
    //     // const address = await web3.eth.getAccounts();
    //     // const user = address[0];
    //     // console.log(user);
    //     // // if (user == this.props.manager) return "a Owner";
    //     // else return "a Lessee"
    // }
    getAvailability(availability) {
        if (availability == 1) return "Available to take on rent";
        else if (availability == -1) return "On maintenance";
        else return "Property not Available";
    }
    onClick = async () => {
        const rentContract = Rent(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await rentContract.methods.payInitialAmount().send({
            from: accounts[0],
            value: this.props.security
        })
    }
    onClickPaySecurity = async () => {
        const today = new Date();
        const date = today.getDate();
        const rentContract = Rent(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await rentContract.methods.paySecurityLessee(date).send({
            from: accounts[0],
            value: this.props.security
        })
    }
    lessorButton(visible)
    {
        if (visible != -1) return "hidden";
        else if (this.state.user == 0) return "hidden";
        else return "none";
    }
    lesseeButton(visible)
    {
        if (visible != 1) return "hidden";
        else if (this.state.user == 1) return "hidden";
        else return "none";
    }
    clickHereButton(avail) {
        const isOwner = this.state.userAddress == this.props.manager;
        console.log(this.state.isLessee);
        if (avail == 0 && (isOwner || this.state.isLessee)) {return "none";}
        else {return "hidden";}
    }
    isOwner() {
        const user = this.state.user;
        if (user == 1) return "YES";
        else return "NO";
    }
    isLessee() {
        const user = this.props.lessee;
        if (user == this.state.userAddress)
            return "YES";
        else return "NO";
    }
    onClickShowDetails = async () => {
        
    }
    render() {
        return (
            < Layout >
                <div style={{color:'white',marginLeft:'13%'}}>
                    Owner: {this.isOwner()}
                </div>
                <div style={{color:'white',marginLeft:'13%'}}>
                    Lessee: {this.isLessee()}
                </div>
                <div style={{color:'white',marginLeft:'13%'}}>
                    Availability: {this.getAvailability(this.props.availability)}
                </div>
                <p></p>
                <Grid>
                    <Grid.Column width={10}>
                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <div style={{visibility: this.lessorButton(this.props.availability) }}>
                            <Button color='green' onClick={this.onClick}>
                                Pay Intial security to make property available for lease!
                            </Button>
                        </div>
                        <div style={{ visibility: this.lesseeButton(this.props.availability)}}>
                            <Button color='green' onClick={this.onClickPaySecurity}>
                                Pay security and take property on rent!
                            </Button>
                        </div>
                        <div style={{ visibility: this.clickHereButton(this.props.availability) }}>
                            <Link route={`/properties/${this.props.address}/details`}>
                                <a>
                                    <Button color='green' onClick={this.onClickShowDetails}>
                                    Click Here >>   
                                     </Button>
                                </a>
                            </Link>  
                        </div>
                        
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}
export default RentShow;