import { FaShareAlt } from 'react-icons/fa'
import { useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import { EmailIcon, EmailShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

const Share = (props) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="spad-share float-start d-flex mt-4">
            <Button variant="light"
                onClick={() => setOpen(!open)}
                aria-controls="share-collapse-icons"
                aria-expanded={open}
            >
                <FaShareAlt />
            </Button>
            <Collapse in={open} dimension="width">
                <div id="share-collapse-icons" className='mt-1'>
                    <div style={{width: '142px', marginLeft: '10px'}}>
                        <TwitterShareButton
                            title="You might find this interesting"
                            url={window.location.href} 
                        >
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton> {" "}
                        <TelegramShareButton
                            title="You might find this interesting"
                            url={window.location.href}
                        >
                            <TelegramIcon size={32} round={true} />
                        </TelegramShareButton> {" "}
                        <WhatsappShareButton 
                            title="You might find this interesting to participate"
                            url={window.location.href}
                        >
                            <WhatsappIcon size={32} round={true} />
                        </WhatsappShareButton> {" "}
                        <EmailShareButton
                            subject="You might find this interesting"
                            body="This is interesting SPAD. Please have a look and participate"
                            url={window.location.href}
                        >
                            <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                    </div>
                </div>
            </Collapse>
        </div>
    );
}

export default Share;