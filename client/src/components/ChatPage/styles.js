import styled from 'styled-components';
import { customColors } from '../../assets/colors';

export const OuterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #1A1A1D;
`

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: ${customColors.black};
    border-radius: 8px;
    height: 60%;
    width: 90%;
`