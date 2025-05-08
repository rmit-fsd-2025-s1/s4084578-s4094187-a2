import { render, screen} from '@testing-library/react'
import Home from '../src/pages/index'
import '@testing-library/jest-dom'

describe('Home', () => {
    
    it('navigation links exist', () => {
        render(<Home/>)
        const testData = screen.getAllByRole('link')
        expect(testData.length).toBeGreaterThanOrEqual(5)
    })

    it('contains the text "tutor" at least once', () => {
        render(<Home/>)
        const testData = screen.getAllByText(/tutor/i)
        expect(testData.length).toBeGreaterThan(0)
    })

    it('contains the text "lecturer" at least once', () => {
        render(<Home/>)
        const testData = screen.getAllByText(/lecturer/i)
        expect(testData.length).toBeGreaterThan(0)
    })

    // "mission" only appears on the homepage
    it('contains the text "mission" at least once', () => {
        render(<Home/>)
        const testData = screen.getAllByText(/mission/i)
        expect(testData.length).toBeGreaterThan(0)
    })

    it('contains three h2 elements', () => {
        render(<Home/>)
        const testData = screen.getAllByRole('heading', { level: 2 })
        expect(testData).toHaveLength(3)
    })
})
