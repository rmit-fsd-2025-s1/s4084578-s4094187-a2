import { render, screen} from '@testing-library/react'
import Home from '../src/pages/lecturers'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import router from 'next-router-mock'

describe('Home', () => {
    
    it('navigation links exist', () => {
        render(<Home/>)
        const testData = screen.getAllByRole('link')
        expect(testData.length).toBeGreaterThanOrEqual(5)
    })

    // "selected" only appears on the lecturers page
    it('contains the text "selected" at least once', () => {
        localStorage.setItem('login', 'lecturer');
        render(<Home/>)
        const testData = screen.getAllByText(/selected/i)
        expect(testData.length).toBeGreaterThan(0)
    })
    
    it('navigates to the homepage when the homepage link is clicked', async () => {
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('homepage-link')
        await tester.click(pageElement)
        expect(router).toMatchObject({ pathname: '/' })
    })

    it('displays "No tutors selected." when the "View Selected Tutors" button ' +
        'is pressed without selecting any tutors', async () => {
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('view-selected-tutors')

        await tester.click(pageElement)
        
        const testData = screen.getAllByText("No tutors selected.")
        expect(testData.length).toBeGreaterThan(0)
    })

    beforeEach(() => {
        // setup some mock data
        const mockTutor1 = {
            Selected: false,
            Name: "John Doe",
            Skills: "Time Management, Research",
            Creds: "Bachelor of Computer Science",
            Courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
            Available: "Part Time",
            TimesSelected: 0
        }
        localStorage.setItem("userInfo1", JSON.stringify(mockTutor1))
        const mockTutor2 = {
            Selected: false,
            Name: "Lily Smith",
            Skills: "Computer Skills, Critical Thinking",
            Creds: "Bachelor of Software Engineering",
            Courses: "Algorithms and Analysis, Full Stack Development",
            Available: "Part Time",
            TimesSelected: 2
        }
        localStorage.setItem("userInfo2", JSON.stringify(mockTutor2))
        const mockTutor3 = {
            Selected: false,
            Name: "Max Payne",
            Skills: "Problem Solving, Independence",
            Creds: "Bachelor of IT",
            Courses: "Full Stack Development, Software Engineering Fundamentals",
            Available: "Full Time",
            TimesSelected: 3
        }
        localStorage.setItem("userInfo3", JSON.stringify(mockTutor3))
        // ensure login
        localStorage.setItem("login", "lecturer")
    })

    it('shows tutors when they are selected', async () => {
        // beforeEach has already set up data for this test
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getAllByTestId('lecturer-tutor-checkbox')
        expect(pageElement.length).toBeGreaterThan(0)

        await tester.click(pageElement[0])

        const testData = screen.queryByText("No tutors selected.")
        expect(testData).not.toBeInTheDocument()
    })

    it('shows no part time tutors when "full time" is put into the search bar', async () => {
        render(<Home/>)
        const tester = userEvent.setup()
        await tester.type(screen.getByTestId('lecturer-search-bar'), 'Full Time')

        const testData = screen.queryByText("Part Time")
        expect(testData).not.toBeInTheDocument()
    })
})