import styled from 'styled-components';
import { customColors } from '../../assets/colors';

export const InfoBarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${customColors.green};
    border-radius: 4px 4px 0 0;
    height: 60px;
    width: 100%;
`
export const LeftInnerContainer = styled.div`
    flex: 0.5;
    display: flex;
    align-items: center;
    margin-left: 5%;
    color: white;
`
  
export const RightInnerContainer = styled.div`
    display: flex;
    flex: 0.5;
    justify-content: flex-end;
    margin-right: 5%;
`