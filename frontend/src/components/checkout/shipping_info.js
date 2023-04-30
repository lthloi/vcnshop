import React, { useState } from "react"
import { styled } from '@mui/material/styles'
import HomeIcon from '@mui/icons-material/Home'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PlaceIcon from '@mui/icons-material/Place'
import PhoneIcon from '@mui/icons-material/Phone'
import PublicIcon from '@mui/icons-material/Public'
import { useForm } from 'react-hook-form'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import DropdownCountry from "./dropdown_country"
import MyLocationIcon from '@mui/icons-material/MyLocation'
import axios from 'axios'
import { EXPRESS_SERVER } from "../../utils/constants"
import { toast } from "react-toastify"
import WarningIcon from '@mui/icons-material/Warning'
import LocalConvenienceStoreIcon from '@mui/icons-material/LocalConvenienceStore'

const defaultInputs = [
    {
        label: 'Address',
        icon: <HomeIcon />,
        required: true,
        maxLength: 80,
    }, {
        label: 'City',
        icon: <LocationCityIcon />,
        required: true,
        maxLength: 50,
    }, {
        label: 'State',
        icon: <LocalConvenienceStoreIcon />,
        required: true,
        maxLength: 50,
    }, {
        label: 'Zip Code',
        icon: <PlaceIcon />,
        required: true,
        maxLength: 20,
    }, {
        label: 'Country',
        icon: <PublicIcon />,
        required: true,
    }, {
        label: 'Phone Number',
        icon: <PhoneIcon />,
        required: false,
        maxLength: 20,
    },
]

const ShippingInfo = () => {
    const { register, handleSubmit, formState: { errors }, setValue, clearErrors, getValues } = useForm()
    const [getLocationLoading, setGetLocationLoading] = useState(false)

    const getUserLocation = async () => {
        let api_to_get_user_location = '/api/getUserLocation'
        let user_location_detail = null

        setGetLocationLoading(true)
        try {
            let { data } = await axios.get(EXPRESS_SERVER + api_to_get_user_location)
            user_location_detail = {
                Country: data.country_name,
                State: data.region_name,
                City: data.city_name,
                'Zip Code': data.zip_code,
            }
        } catch (error) {
            user_location_detail = error
        }
        setGetLocationLoading(false)

        if (user_location_detail instanceof Error)
            return toast.error(user_location_detail.response ? user_location_detail.response.data.message : 'Something went wrong, please try again some minutes later!')

        for (let { label } of defaultInputs) {
            if (user_location_detail[label]) setValue(label, user_location_detail[label])
            if (getValues(label)) clearErrors(label)
        }

        toast.success('Apply your location successfully!')
    }

    const shippingSubmit = (data, e) => {
        e.preventDefault()


    }

    return (
        <ShippingInfoSection
            id="ShippingInfoSection"
            onSubmit={handleSubmit(shippingSubmit)}
        >
            <SectionTitle>Shipping Info</SectionTitle>

            <UserLocationSection>
                <StyledMyLocationIcon
                    titleAccess="Click to use your location"
                    onClick={getUserLocation}
                    sx={getLocationLoading && { animationDuration: '2s', pointerEvents: 'none' }}
                />
                <UserLocationText>USE MY LOCATION</UserLocationText>
            </UserLocationSection>

            <InputsContainer>
                {
                    defaultInputs.map(({ label, icon, required, maxLength }) => (
                        <FormGroup key={label}>
                            <InputLabel>{label}</InputLabel>
                            <TitleAndInput>
                                {icon}
                                {
                                    label === 'Country' ?
                                        <DropdownCountry
                                            setCountryValue={setValue}
                                            register={register}
                                            label={label}
                                            required={required}
                                            errors={errors}
                                        />
                                        :
                                        <Input
                                            placeholder={'Enter ' + label + ' here...'}
                                            {...register(label, { required })}
                                            maxLength={maxLength}
                                        />
                                }
                            </TitleAndInput>
                            {
                                errors[label] &&
                                <InputWarning>
                                    <WarningIcon sx={{ color: 'red', fontSize: '1.2em' }} />
                                    <span>Please don't empty this field</span>
                                </InputWarning>
                            }
                        </FormGroup>
                    ))
                }
            </InputsContainer>

            <SubmitBtn type="submit">
                <span>Continue</span>
                <DoubleArrowIcon />
            </SubmitBtn>
        </ShippingInfoSection>
    )
}

export default ShippingInfo

const ShippingInfoSection = styled('form')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '15px',
    width: '100%',
    position: 'relative',
}))

const SectionTitle = styled('h2')({
    margin: '0',
    marginTop: '20px',
    fontFamily: '"Roboto", "sans-serif"',
    borderBottom: '2px black solid',
    fontSize: '1.8em',
    paddingBottom: '3px',
})

const UserLocationSection = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '15%',
    right: '10%',
})

const StyledMyLocationIcon = styled(MyLocationIcon)({
    margin: 'auto',
    fontSize: '2em',
    padding: '5px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px white solid',
    animation: 'get_user_location 0s infinite linear',
    '@keyframes get_user_location': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
    },
    '&:hover': {
        outline: '2px black solid',
    },
})

const UserLocationText = styled('div')({
    marginTop: '10px',
    fontFamily: '"Roboto", "sans-serif"',
    fontSize: '1em',
    paddingBottom: '1px',
    borderBottom: '2px black solid',
})

const InputsContainer = styled('div')({
    padding: '0 10px 10px',
    width: '40%',
})

const FormGroup = styled('div')({
    marginTop: '20px',
    width: '100%',
})

const TitleAndInput = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    width: '100%',
})

const InputLabel = styled('label')({
    display: 'block',
    fontSize: '1em',
    fontFamily: '"Roboto", "sans-serif"',
    fontWeight: 'bold',
    marginBottom: '5px',
    marginLeft: '40px',
})

const Input = styled('input')({
    border: '1px black solid',
    width: '100%',
    padding: '10px 15px',
    fontSize: '1em',
    fontFamily: '"Roboto", "sans-serif"',
    outline: 'unset',
    '&:focus': {
        borderRightWidth: '8px',
        outline: '1.5px black solid',
    },
})

const InputWarning = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    padding: '3px',
    fontSize: '0.9em',
    fontFamily: '"Roboto", "sans-serif"',
    color: 'red',
    marginLeft: '40px',
    marginTop: '3px',
})

const SubmitBtn = styled('button')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    backgroundColor: 'black',
    color: 'white',
    padding: '8px 30px',
    fontFamily: '"Roboto", "sans-serif"',
    fontSize: '1em',
    marginTop: '20px',
    border: '2px black solid',
    cursor: 'pointer',
    boxSizing: 'border-box',
    borderRadius: '20px',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    },
    '&:active': {
        backgroundColor: 'black',
        color: 'white',
    },
})