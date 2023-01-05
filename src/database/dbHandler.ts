import { City, Institution, InstitutionLocation, InstitutionScreenshot, Prisma } from "@prisma/client";
import prisma from "./prisma";

export type InstitutionProps = Institution & {
    City: City;
    InstitutionLocation: (InstitutionLocation & {
        City: City;
    })[];
}

export const getDbInstitutions = async (): Promise<InstitutionProps[]> => {
    return await prisma.institution.findMany({
        include: {
            City: true,
            InstitutionLocation: {
                include: {
                    City: true
                }
            }
        }
    });
}

// export interface ScreenshotProps {
//     institutionId: string
//     filename: string
//     url: string
//     index: number
//     type: "full" | "thumbnail"
//     pairIndex: number
// }
// export const saveScreenshot = async (data: ScreenshotProps[]) => {

//     await prisma.institutionScreenshot.createMany({
//         data: data.map(props => {
//             return {
//                 institution_id: props.institutionId,
//                 filename: props.filename,
//                 url: props.url,
//                 screen_index: props.index,
//                 timestamp: Date.now(),
//                 type: props.type,
//                 pair_index: props.pairIndex
//             }
//         })
//     });
// }