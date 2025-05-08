import { render, screen, waitFor} from '@testing-library/react'
import Home from '../src/pages/tutors'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

describe('Home', () => {
    
    it('navigation links exist', () => {
        render(<Home/>)
        const testData = screen.getAllByRole('link')
        expect(testData.length).toBeGreaterThanOrEqual(5)
    })

    // "following" only appears on the tutor page
    it('contains the text "following" at least once', () => {
        localStorage.setItem('login', 'tutor')
        render(<Home/>)
        const testData = screen.getAllByText(/following/i)
        expect(testData.length).toBeGreaterThan(0)
    })

    it('alert is created on clicking "Update Details" button', async () => {
        localStorage.setItem('login', 'tutor')
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('tutor-update-button')
        // rewire alerts from the page so that they don't interrupt testing and can be observed
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

        await tester.click(pageElement)
        expect(alertMock).toHaveBeenCalledWith('Tutor details updated!')

        // reset alerts to normal behaviour
        alertMock.mockRestore()
    })

    it('4 apply/remove buttons exist when there is a authorised user', () => {
        localStorage.setItem('login', 'tutor')
        render(<Home/>)
        const pageElement = screen.getAllByTestId('tutor-apply-button')
        expect(pageElement).toHaveLength(4)
    })

    it('page is updated properly after the name is changed', async () => {
        localStorage.setItem('login', 'tutor')
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('tutor-update-button')
        // rewire alerts from the page so that they don't interrupt testing and can be observed
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

        await tester.clear(screen.getByTestId('tutor-update-name'))
        await tester.type(screen.getByTestId('tutor-update-name'), 'Water Bottle')
        await tester.click(pageElement)

        const testData = screen.getAllByText('Water Bottle')
        expect(testData.length).toBeGreaterThan(0)

        // reset alerts to normal behaviour
        alertMock.mockRestore()
    })

    it('localStorage is updated properly after the name is changed', async () => {
        localStorage.setItem('login', 'tutor')
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('tutor-update-button')
        // rewire alerts from the page so that they don't interrupt testing and can be observed
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

        await tester.clear(screen.getByTestId('tutor-update-name'))
        await tester.type(screen.getByTestId('tutor-update-name'), 'Water Bottle')
        await tester.click(pageElement)
        
        const testData = JSON.parse(localStorage.getItem("userInfo-1") ?? '{}')
        expect(testData.Name).toBe("Water Bottle")

        // reset alerts to normal behaviour
        alertMock.mockRestore()
    })

    beforeEach(() => {
        localStorage.clear()
        // setup some mock data
        const mockTutor1 = {
            Email: "JohnDoe@rmit.edu.au",
            Selected: false,
            Name: "John Doe",
            Skills: "Time Management, Research",
            Creds: "Bachelor of Computer Science",
            Courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
            Available: "Part Time",
            TimesSelected: 0
        }
        localStorage.setItem("account", "JohnDoe@rmit.edu.au")
        localStorage.setItem("userInfo0", JSON.stringify(mockTutor1))
        localStorage.setItem("login", "tutor")
    })

    it('apply button adds course to localStorage', async () => {
        render(<Home/>)
        const pageElement = screen.getAllByTestId('tutor-apply-button')
        const tester = userEvent.setup()

        expect(pageElement[0]).toHaveTextContent("Apply")

        await tester.click(pageElement[0])

        let data = JSON.parse(localStorage.getItem("userInfo-1") ?? "{}")
        expect(data.Courses.split(", ")).toHaveLength(3)
    })

    it('remove button removes course from localStorage', async () => {
        render(<Home/>)
        const pageElement = screen.getAllByTestId('tutor-apply-button')
        const tester = userEvent.setup()

        expect(pageElement[3]).toHaveTextContent("Remove")

        await tester.click(pageElement[3])

        let data = JSON.parse(localStorage.getItem("userInfo-1") ?? "{}")
        expect(data.Courses.split(", ")).toHaveLength(1)
    })
})