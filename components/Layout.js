import React from 'react';
import { Container,Header,Icon,Statistic } from 'semantic-ui-react';
import Head from 'next/head';
export default(props)=>{
    return(
        <Container style={{backgroundColor:'black',width:'100%',height:'1000px'}}>
            <Head>
            <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        ></link></Head>
            <Header style ={{marginTop:'30px',marginLeft:'45%',marginBottom:'70px',color:'Red'}}as='h2' icon >
    <Icon name='building' />
    PROPERTY RENTAL
  </Header>
            {props.children}
        </Container>
    );
};

