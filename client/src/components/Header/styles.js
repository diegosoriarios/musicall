import styled from 'styled-components';
import { customColors } from '../../assets/colors';

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    background-color: ${customColors.black};
    justify-content: center;
    align-items: center;
`

export const BackButton = styled.button`
    position: absolute;
    left: 2%;
`

export const RightButton = styled.div`
    position: absolute;
    right: 4%;
`
