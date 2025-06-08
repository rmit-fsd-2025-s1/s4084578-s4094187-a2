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

  // update tutor details using email
  async updateByEmail(request: Request, response: Response) {
    const email = request.params.email
    const { name, availability, skills, creds } = request.body

    if (!email) {
      response.status(400).json({ message: "No email passed to controller when updating Tutor details" })
      return
    }

    let tutorToUpdate = await this.tutorRepository.findOne({ where: { email } })

    if (!tutorToUpdate) {
      response.status(404).json({ message: "Controller unable to find tutor" })
      return
    }

    tutorToUpdate.name = name
    tutorToUpdate.availableFullTime = availability
    tutorToUpdate.skillsList = skills
    tutorToUpdate.academicCredentials = creds

    try {
      const updatedTutor = await this.tutorRepository.save(tutorToUpdate)
      response.json(updatedTutor)
      return
    } 
    catch (error) {
      response.status(400).json({ message: "Error updating tutor", error })
      return
    }
  }
}
