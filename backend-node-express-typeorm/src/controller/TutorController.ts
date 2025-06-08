import { Request, Response } from "express"
import { Tutor } from "../entity/Tutor"
import { getDataSource } from "../utils/getDataSource"

export class TutorController {

  tutorRepository = getDataSource().getRepository(Tutor)

  // retrive tutor details using email
  async getByEmail(request: Request, response: Response) {
    const email = request.params.email

    if (!email) {
      response.status(400).json({ message: "No email passed to controller when getting Tutor details" })
      return
    }

    const tutor = await this.tutorRepository.findOne({
      where: { email },
      select: ["name", "availableFullTime", "skillsList", "academicCredentials"]
    })

    if (!tutor) {
      response.status(404).json({ message: "Controller unable to find tutor" })
      return
    }

    response.json(tutor)
    return
  }
}
