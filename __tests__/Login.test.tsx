import { render, screen} from '@testing-library/react'
import Home from '../src/pages/login'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

describe('Home', () => {
    
    it('navigation links exist', () => {
        render(<Home/>)
        const testData = screen.getAllByRole('link')
        expect(testData.length).toBeGreaterThanOrEqual(5)
    })

    // "in!" only appears on the login page
    it('contains the text "in!" at least once', () => {
        render(<Home/>)
        const testData = screen.getAllByText(/in!/i)
        expect(testData.length).toBeGreaterThan(0)
    })

    it('produces an alert when login is clicked before anything is entered into the form', async () => {
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('login-button')
        // rewire alerts from the page so that they don't interrupt testing and can be observed
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

        await tester.click(pageElement)
        expect(alertMock).toHaveBeenCalledWith('email or password invalid')

        // reset alerts to normal behaviour
        alertMock.mockRestore()
    })

    // the following tests will cause the test environment to attempt to change page
    // this is an issue as the tests are not done in a browser
    // tests are done in an environment where changing page is not possible
    // adding this beforeEach() and AfterEach() will handle this issue
    const originalLocation = window.location;

    beforeEach(() => {
        // remove the location property from the window object so that the location property cannot be used
        delete (window as any).location;
        // mocking the location property for the window object so that the window object can be used
        (window as any).location = { href: '', assign: jest.fn() };
    })

    afterEach(() => {
        // restore the real window.location
        (window as any).location = originalLocation;
    })

    beforeEach(() => {
        const sampleUsers = [
            {
              //Admin Login Data, Registered as both lecturer and tutor for testing.
              Email: "Admin@rmit.edu.au",
              Password: "password",
              Selected: false,
              Name: "Admin",
              Skills: "All",
              Creds: "All",
              Courses: "All",
              Available: "Full Time",
              TimesSelected: 0
            },
            {
              //Lecturer Login Data
              Email: "Lecturer@rmit.edu.au",
              Password: "password",
              Lecturer: true
            },
            {
              Email: "JohnDoe@rmit.edu.au",
              Password: "password",
              Lecturer: false,
              Selected: false,
              Name: "John Doe",
              Skills: "Time Management, Research",
              Creds: "Bachelor of Computer Science",
              Courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
              Available: "Part Time",
              TimesSelected: 0
            },
            {
              Email: "LilySmith@rmit.edu.au",
              Password: "p455w0rd",
              Lecturer: false,
              Selected: false,
              Name: "Lily Smith",
              Skills: "Computer Skills, Critical Thinking",
              Creds: "Bachelor of Software Engineering",
              Courses: "Algorithms and Analysis, Full Stack Development",
              Available: "Part Time",
              TimesSelected: 2
            },
            {
              Email: "MaxPayne@rmit.edu.au",
              Password: "rockstar",
              Lecturer: false,
              Selected: false,
              Name: "Max Payne",
              Skills: "Problem Solving, Independence",
              Creds: "Bachelor of IT",
              Courses: "Full Stack Development, Software Engineering Fundamentals",
              Available: "Full Time",
              TimesSelected: 3
            },
            {
              Email: "RichardMiles@rmit.edu.au",
              Password: "carfan77",
              Lecturer: false,
              Selected: false,
              Name: "Richard Miles",
              Skills: "Research, Critical Thinking",
              Creds: "Bachelor of Software Engineering",
              Courses: "Full Stack Development, Algorithms and Analysis",
              Available: "Full Time",
              TimesSelected: 2
            },
            {
              Email: "SteveJoes@rmit.edu.au",
              Password: "ApplesTasteGood",
              Lecturer: false,
              Selected: false,
              Name: "Steve Joes",
              Skills: "Computer Skills, Independence",
              Creds: "Bachelor of Computer Science",
              Courses: "Software Engineering Fundamentals, Algorithms and Analysis",
              Available: "Part Time",
              TimesSelected: 5
            },
            {
              Email: "BallGates@rmit.edu.au",
              Password: "Win10Forever",
              Lecturer: false,
              Selected: false,
              Name: "Ball Gates",
              Skills: "Problem Solving, Time Management",
              Creds: "Bachelor of IT",
              Courses: "Software Engineering Fundamentals, Introduction to Cyber Security",
              Available: "Part Time",
              TimesSelected: 4
            }
          ];
      
            // Put fake data in localStorage
          sampleUsers.forEach((user, index) => {
              localStorage.setItem(`userInfo${index}`, JSON.stringify(user));
          });
    })

    it('sets localStorage correctly upon a successful tutor login', async () => {
        render(<Home/>)
        const tester = userEvent.setup()
    
        await tester.type(screen.getByTestId('login-email-field'), 'JohnDoe@rmit.edu.au')
        await tester.type(screen.getByTestId('login-password-field'), 'password')
        await tester.click(screen.getByTestId('login-button'))
    
        expect(localStorage.getItem('login')).toBe('tutor')
    })

    it('sets localStorage correctly upon a successful lecturer login', async () => {
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('login-button')

        // input values and click login
        await tester.type(screen.getByTestId('login-email-field'), 'Lecturer@rmit.edu.au')
        await tester.type(screen.getByTestId('login-password-field'), 'password')
        await tester.click(pageElement)

        expect(localStorage.getItem('login')).toBe('lecturer')
    })

    it('sets localStorage correctly upon a successful admin login', async () => {
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('login-button')

        // input values and click login
        await tester.type(screen.getByTestId('login-email-field'), 'Admin@rmit.edu.au')
        await tester.type(screen.getByTestId('login-password-field'), 'password')
        await tester.click(pageElement)

        expect(localStorage.getItem('login')).toBe('admin')
    })

    it('after a valid email address is entered, the invalid email error message no longer shows', async () => {
        render(<Home/>)
        const tester = userEvent.setup()

        const testData = screen.getAllByText("Valid email is required.")
        expect(testData).toHaveLength(1)

        await tester.type(screen.getByTestId('login-email-field'), 'wrongEmail@rmit.edu.au')

        expect(screen.queryByText("Valid email is required.")).not.toBeInTheDocument()
    })

    it('after a valid password is entered, the invalid email error message no longer shows', async () => {
        render(<Home/>)
        const tester = userEvent.setup()

        const testData = screen.getAllByText("Valid email is required.")
        expect(testData).toHaveLength(1)

        await tester.type(screen.getByTestId('login-password-field'), '12345678')

        expect(screen.queryByText("Valid password is required.")).not.toBeInTheDocument()
    })
})