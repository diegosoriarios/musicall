import styled from 'styled-components';

import { customColors } from '../../assets/colors';

export const Form = styled.form`
    display: flex;
    max-height: 70px;
`

export const TextInput = styled.input`
    border: none;
    border-radius: 0;
    padding: 12px;
    width: 80%;
    font-size: 1.2em;
`

export const Button = styled.button`
    color: ${customColors.black} !important;
    text-transform: uppercase;
    text-decoration: none;
    background: ${customColors.green};
    padding: 20px;
    display: inline-block;
    border: none;
    width: 20%;
`