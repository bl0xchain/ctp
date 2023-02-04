import { Col, Container, Row } from "react-bootstrap";
import Header from "../components/Header";
import ctpImage from "../images/ctp-chart.jpg";

const About = () => {
    return (
        <>
        <Header />
            <div className="about-banner">
                <div>
                    <h1 className="mb-4">CTP Index</h1>
                    <h2>The Crypto Index Funds</h2>
                </div>
            </div>
            <Container className="py-5">
                <h1 className="text-center">What is CTP Index</h1>
                <Row>
                    <Col>
                        <img className="img-fluid" src={ctpImage} alt="" />
                    </Col>
                    <Col>
                        <div className="mt-5">
                        A CTP Index is a type of investment vehicle that allows investors to gain exposure to a diversified portfolio of cryptocurrencies. The fund is constructed using a set of rules and criteria that determine the selection and weighting of the cryptocurrencies that make up the fund.
                        </div>
                        <div className="mt-4">
                        The fund's value is based on the performance of the underlying cryptocurrencies, which are tracked and managed by the CTP. The fund manager is responsible for making decisions about which cryptocurrencies to include in the fund, as well as adjusting the weightings of the individual cryptocurrencies based on market conditions.
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="bg-light">
                <Container className="py-5">
                    <h2 className="mb-4">Benefits of CTP</h2>
                    <p className="mb-4">Investors can mint CTP10 or CTP50, much like they would with a traditional stock or mutual fund. </p>
                    <p className="mb-4">One of the main benefits of a CTP10 or CTP50 is that it allows investors to gain exposure to a diverse range of cryptocurrencies, rather than having to pick and choose individual coins. This can help to mitigate risk and provide a more stable investment opportunity. Additionally, index funds generally have lower management fees than actively managed funds, making them more cost-efficient for investors.</p>
                    <p>Overall, a crypto index fund is a useful tool for investors looking to gain exposure to the cryptocurrency market, without the need for extensive research and analysis of individual</p>
                </Container>
            </div>
        </>
    )
}

export default About;