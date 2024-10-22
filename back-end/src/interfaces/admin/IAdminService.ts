import { IAdmin } from "../../services/admin/adminServices";

export interface IAdminService {
    signIn(formData:IAdmin):Promise<any>
}