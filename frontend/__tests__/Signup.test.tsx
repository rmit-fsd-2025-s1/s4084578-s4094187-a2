import { render, screen} from '@testing-library/react'
import Home from '../src/pages/signup'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

describe('Home', () => {
    
    it('navigation links exist', () => {
        render(<Home/>)
        const testData = screen.getAllByRole('link')
        expect(testData.length).toBeGreaterThanOrEqual(5)
    })

    // "already" only appears on the sign up page
    it('contains the text "already" at least once', () => {
        render(<Home/>)
        const testData = screen.getAllByText(/already/i)
        expect(testData.length).toBeGreaterThan(0)
    })

    it('produces an alert when login is clicked before anything is entered into the form', async () => {
        render(<Home/>)
        const tester = userEvent.setup()
        const pageElement = screen.getByTestId('signup-button')
        // rewire alerts from the page so that they don't interrupt testing and can be observed
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

        await tester.click(pageElement)
        expect(alertMock).toHaveBeenCalledWith('Non Functioning')

        // reset alerts to normal behaviour
        alertMock.mockRestore()
    })
})