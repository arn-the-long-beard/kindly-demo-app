import React from 'react';
import axios from 'axios';
import styles from '../styles/main.scss';
import classNames from 'classnames';
import io from 'socket.io-client';
import ChatMessage from './ChatMessage';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatmessages: [],
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.messageReceived = this.messageReceived.bind(this);
    }
    componentDidMount() {
        this.socket = io();
        this.socket.on('connect', () => {
        });
        this.socket.on('chatmessage', this.messageReceived);
        axios
        .get('/chatmessages')
        .then((response) => {
            this.setState({
                chatmessages: response.data,
            });
        })
        .catch((error) => {
            console.trace(error);
        })
        .then(() => {
            this.autoScrollToBottom();
            this.messageInput.focus();
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        const message = this.messageInput.value.trim();
        this.sendMessage({
            message: message
        });
    }
    sendMessage(obj) {
        if ( !obj.message ) {
            return false;
        }

        axios.post(
            '/chatmessage',
            {
                chat_id: "598dcde4b98a0b0010ccaf56",
                message: obj.message,
            }
        );
        this.messageInput.value = "";
    }
    messageReceived(chatmessage) {
        this.setState(function(state) {
            return {
                chatmessages: state.chatmessages.concat(chatmessage)
            }
        });
        this.autoScrollToBottom();
    }
    autoScrollToBottom() {
        const scrollHeight          = this.messageList.scrollHeight;
        const height                = this.messageList.clientHeight;
        const maxScrollTop          = scrollHeight - height;
        this.messageList.scrollTop  = maxScrollTop > 0 ? maxScrollTop : 0;
    }
    render() {
        return (
            <div className="chat-demo">
                <div className="chat-messages" ref={(div) => { this.messageList = div; }}>
                {
                    this.state.chatmessages.map((chatmessage) => {
                        return (
                            <ChatMessage key={chatmessage._id} chatmessage={chatmessage} />
                        )
                    })
                }
                </div>
                <div className="chat-form">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <input ref={(input) => { this.messageInput = input; }} type="text" placeholder="Ask me anything" />
                    </form>
                </div>
            </div>
        );
    }
}