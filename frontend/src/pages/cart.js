import React from "react"
import { styled } from '@mui/material/styles'
import SummarySection from "../components/cart/summary_section/summary_section"
import ProductCardsSection from "../components/cart/products/product_cards_section"
import { useSelector } from "react-redux"
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import ScrollToTopBtn from '../components/scroll_top_top_btn'
import HelpChat from '../components/help_chat'

const Cart = () => {
    const { cartItems } = useSelector(({ cart }) => cart)

    return (
        <CartArea id="CartArea">
            <PageTitle>
                <ShoppingBagIcon sx={{ height: '1.8em', width: '1.8em', }} />
                <Text>
                    {'SHOPPING CART - ( ITEMS: ' + cartItems.length + ' )'}
                </Text>
            </PageTitle>

            <CartContainer>
                {
                    cartItems &&
                    <>
                        <ProductCardsSection cartItems={cartItems} />
                        <SummarySection cartItems={cartItems} />
                    </>
                }
            </CartContainer>

            <ScrollToTopBtn />
            <HelpChat />
        </CartArea>
    )
}

export default Cart

const CartArea = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    padding: '0 50px',
}))

const PageTitle = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginLeft: '20px',
    transform: 'scaleY(0.8)',
})

const Text = styled('h2')({
    fontSize: '1.8em',
    fontFamily: '"Kanit", "sans-serif"',
    margin: '0',
})

const CartContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    boxSizing: 'border-box',
    paddingTop: '10px',
    borderTop: '2px black solid',
})