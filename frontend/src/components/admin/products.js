import React, { useMemo } from "react"
import { styled } from '@mui/material/styles'
import AutoIncreaAnimate from "../auto_increa_animate"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import AllInboxIcon from '@mui/icons-material/AllInbox'
import OutboxIcon from '@mui/icons-material/Outbox'
import ErrorIcon from '@mui/icons-material/Error'
import { Tooltip as TooltipMUI } from "@mui/material"
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const options = {
    responsive: true,
    plugins: {
        datalabels: {
            formatter: function (value) {
                return value.nested.value
            },
            font: {
                size: 16,
            }
        },
    },
    parsing: {
        key: 'nested.value',
    }
}

const gender_labels = [
    {
        label: 'Male',
        backgroundColor: "rgb(255,224,230)",
        borderColor: "rgba(255, 99, 132, 1)",
    }, {
        label: 'Female',
        backgroundColor: "rgb(215,236,251)",
        borderColor: "rgba(54, 162, 235, 1)",
    }, {
        label: 'Other',
        backgroundColor: "rgb(219,242,242)",
        borderColor: "rgb(84,200,200)",
    }
]

const set_chart_data = (data_object) => {
    return {
        datasets: [
            {
                label: "Number Of Products",
                data: gender_labels.map(({ label }) => ({
                    id: label,
                    nested: { value: data_object[label] }
                })),
                backgroundColor: gender_labels.map(({ backgroundColor }) => backgroundColor),
                borderColor: gender_labels.map(({ borderColor }) => borderColor),
                borderWidth: 1,
            }
        ]
    }
}

const style_for_icons = {
    color: 'white',
}

const set_sums = (count_orders, count_users) => [
    {
        label: 'Products\'s Total',
        icon: <AllInboxIcon sx={style_for_icons} />,
        count: count_orders,
    }, {
        label: 'Stock Out',
        icon: <OutboxIcon sx={style_for_icons} />,
        count: count_users,
    },
]

const Products = ({ products }) => {

    const counted_product_groups = useMemo(() => {
        let gender_obj = { Male: 0, Female: 0, Other: 0 }
        for (let { for: valid_genders } of products)
            for (let gender of valid_genders)
                gender_obj[gender]++
        return gender_obj
    }, [products])

    const count_stock_out_product = useMemo(() => {
        return products.filter(({ stock }) => stock * 1 === 0).length
    }, [products])

    return (
        <ProductsSection id="ProductsSection">
            <div style={{ width: '100%' }}>
                <SectionTitle>Totals</SectionTitle>
                <Note>
                    <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                    <span>Display the totals up to now</span>
                </Note>
            </div>
            <Sums>
                {
                    set_sums(products.length, count_stock_out_product)
                        .map(({ label, icon, count }) => (
                            <Sum key={label}>
                                <SumContainer>
                                    <IconWrapper>{icon}</IconWrapper>
                                    <div>
                                        <div style={{ marginBottom: '5px', color: 'gray' }}>
                                            {label}
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '1.5em', fontWeight: 'bold' }}>
                                            <AutoIncreaAnimate number={count} />
                                        </div>
                                    </div>
                                </SumContainer>
                            </Sum>
                        ))
                }
            </Sums>
            <div
                id="BarChartSection"
                style={{ width: '100%', marginTop: '30px' }}
            >
                <SectionTitle>Group The Products By Gender</SectionTitle>
                <Note>
                    <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                    <span>Display the groups was grouped to Male and Female and Other</span>
                </Note>
                <div style={{ display: 'flex', columnGap: '30px', justifyContent: 'space-evenly' }}>
                    <div>
                        <Doughnut
                            options={options}
                            data={set_chart_data(counted_product_groups)}
                        />
                    </div>
                    <Annotation>
                        <SectionTitle>Annotation</SectionTitle>
                        <div>
                            {
                                gender_labels.map(({ label, backgroundColor, borderColor }) => (
                                    <GenderColorContainer key={label}>
                                        <GenderColor sx={{ backgroundColor, border: `1.5px ${borderColor} solid` }} />
                                        <span>{label}</span>
                                        <TooltipMUI title={`Number of the products for ${label}`}>
                                            <ErrorIcon sx={{ fontSize: '1.3em', color: 'gray' }} />
                                        </TooltipMUI>
                                    </GenderColorContainer>
                                ))
                            }
                        </div>
                    </Annotation>
                </div>
            </div>
        </ProductsSection>
    )
}

export default Products

const ProductsSection = styled('div')(({ theme }) => ({
    display: 'flex',
    rowGap: '20px',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
}))

const SectionTitle = styled('div')({
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    width: '100%',
    boxSizing: 'border-box',
})

const Sums = styled('div')({
    display: 'flex',
    columnGap: '20px',
    justifyContent: 'space-evenly',
    width: '100%',
})

const Sum = styled('div')({
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 3px gray',
    width: '230px',
    boxSizing: 'border-box',
})

const SumContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '20px',
    columnGap: '30px',
    borderBottom: '1px lightgrey solid',
    borderRadius: '10px',
})

const IconWrapper = styled('div')({
    padding: '10px',
    backgroundColor: 'black',
    height: 'fit-content',
    borderRadius: '5px',
})

const Note = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '5px',
    paddingLeft: '10px',
    marginBottom: '10px',
    '& span': {
        fontFamily: '"Nunito", "sans-serif"',
        fontSize: '0.8em',
    }
})

const Annotation = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
})

const GenderColorContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '15px',
    marginTop: '10px',
})

const GenderColor = styled('div')({
    height: '20px',
    width: '50px',
})