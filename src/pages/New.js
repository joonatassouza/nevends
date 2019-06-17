import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showLoading } from '../store/Actions'
import api from '../services/api';
import './New.css';

class New extends Component {
    state = {
        image: null,
        author: '',
        place: '',
        description: '',
        hashtags: '',
        validations: {}
    }

    handleSubmit = async e => {
        e.preventDefault();
        
        try {
            this.props.showLoading(true);

            if (!this.state.image) {
                this.setState({ validations: { ...this.state.validations, image: 'Obrigatório'}})
                return;
            }
            if (!this.state.author) {
                this.setState({ validations: { ...this.state.validations, author: 'Obrigatório'}})
                return;
            }
            if (!this.state.place) {
                this.setState({ validations: { ...this.state.validations, place: 'Obrigatório'}})
                return;
            }
            if (!this.state.description) {
                this.setState({ validations: { ...this.state.validations, description: 'Obrigatório'}})
                return;
            }

            const data = new FormData();

            data.append('image', this.state.image);
            data.append('author', this.state.author);
            data.append('place', this.state.place);
            data.append('description', this.state.description);
            data.append('hashtags', this.state.hashtags);

            await api.post('posts', data);
        
        } catch(e) {
            NotificationManager.error('Internal Server Error', 'Entre em contato com o Administrador do sistema', 5000);
        } finally {
            this.props.showLoading(false);
        }

        this.props.history.push('/');
    };

    handleImageChange = e => {
        this.setState({ validations: { ...this.state.validations, image: '' } });
        this.setState({ image: e.target.files[0] });
    };

    handleChange = e => {
        this.setState({ validations: { ...this.state.validations, [e.target.name]: '' } });
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <form id='new-post' onSubmit={this.handleSubmit}>
                { this.state.validations.image ? <span className='validation'>{this.state.validations.image}</span> : ''}
                <input type='file' onChange={this.handleImageChange} disabled={this.props.loading} accept="image/*"/>
                { this.state.validations.author ? <span className='validation'>{this.state.validations.author}</span> : ''}
                <input type='text' onChange={this.handleChange} disabled={this.props.loading} value={this.state.author} name='author' placeholder='Autor do post'/>
                { this.state.validations.place ? <span className='validation'>{this.state.validations.place}</span> : ''}
                <input type='text' onChange={this.handleChange} disabled={this.props.loading} value={this.state.place} name='place' placeholder='Local do post'/>
                { this.state.validations.description ? <span className='validation'>{this.state.validations.description}</span> : ''}
                <input type='text' onChange={this.handleChange} disabled={this.props.loading} value={this.state.description} name='description' placeholder='Descrição do post'/>
                <input type='text' onChange={this.handleChange} disabled={this.props.loading} value={this.state.hashtags} name='hashtags' placeholder='Hashtags do post'/>
                <button type='submit' disabled={this.props.loading}>Enviar</button>
            </form>
        );
    }
}


const mapStateToProps = state => ({ loading: state.loading });

const mapDispatchToProps = dispatch => bindActionCreators({showLoading}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(New);