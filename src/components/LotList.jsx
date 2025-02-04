

import { useContext } from "react";
import { LotContext } from "../context/LotContext";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
function LotList()
{

    const {lots}=useContext(LotContext)

    return(

        <Container>

            <h1 className="mt-4"> İş Emri Listesi</h1>
            {lots.length===0 ? (
                <div><p className="text-muted"> Henüz bir iş eklenmedi. İş Emri eklemek için </p>  <Link className="nav-link" to="/lotform">TIKLAYINIZ...</Link>  {/* Link to Lot Form */}</div>
                
                
            ):(
             <Row className="mt-3">

                    {lots.map((lot)=>(
                            <Col key={lot.lotNumber} md={4} sm={6} xs={12} className="mb-4">
                            


                            <Card>
                            <Card.Body>

                                <Card.Title>

                                    Lot No: {lot.lotNumber}
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">

                                    {lot.productName}
                                </Card.Subtitle>

                                <Card.Text>
                                <strong>Adet:</strong> {lot.quantity} <br />
                                <strong>Durum:</strong> {lot.status}

                                </Card.Text>
                            </Card.Body>

                            </Card>
                            </Col>

                    ))}

             </Row>
             
                
            )}
         </Container>
    );
}


export default LotList;