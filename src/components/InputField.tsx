// import {
//     Button,
//     ButtonGroup,
//     Card,
//     CardBody,
//     CardFooter,
//     CardHeader,
//     Field,
//     FieldLabel,
//     Heading,
//     Input,
//     Separator,
//     Stack
// } from '@chakra-ui/react';
// import React from "react";
// import {Link} from "react-router-dom";
//
//
// interface Props {
//     heading: string
//     navLink: string
//     label:string
//     value:string
//     navMessage: string
// }
//
// const CredantialCard = ({ label,value}: Props) => {
//
//     return (
//         <>
//
//
//             <Field.Root>
//                 <FieldLabel>{label}</FieldLabel>
//                 <Input
//                     value={value}
//                     onChange={() => onChange()}
//                     onBlur={() => onBlur()}
//                     animation={formErrors.username && usernameTouched ? `${shake} 0.3s` : undefined}
//                     key={usernameShakeKey} // change key to retrigger animation
//                     placeholder="Enter Username"
//                 />
//                 {formErrors.username && usernameTouched && (
//                     <Field.ErrorText>{formErrors.username[0]}</Field.ErrorText>
//                 )}
//
//             </Field.Root>
//
//
//         </>
//     )
// }