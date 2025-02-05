import React from 'react'
import { instance, mock } from 'ts-mockito'
import { fireEvent, render, screen } from 'uiSrc/utils/test-utils'
import SetDetails, { Props } from './SetDetails'

const members = ['member1', 'member2', 'member3']
const mockedProps = mock<Props>()

jest.mock('uiSrc/slices/set', () => {
  const defaultState = jest.requireActual('uiSrc/slices/set').initialState
  return ({
    setSelector: jest.fn().mockReturnValue(defaultState),
    setDataSelector: jest.fn().mockReturnValue({
      ...defaultState,
      total: 3,
      key: 'z',
      keyName: 'z',
      members,
    }),
    fetchSetMembers: () => jest.fn()
  })
})

describe('SetDetails', () => {
  it('should render', () => {
    expect(render(<SetDetails {...instance(mockedProps)} />)).toBeTruthy()
  })

  it('should render rows properly', () => {
    const { container } = render(<SetDetails {...instance(mockedProps)} />)
    const rows = container.querySelectorAll('.ReactVirtualized__Table__row[role="row"]')
    expect(rows).toHaveLength(members.length)
  })

  it('should render search input', () => {
    render(<SetDetails {...instance(mockedProps)} />)
    expect(screen.getByTestId('search')).toBeTruthy()
  })

  it('should call search', () => {
    render(<SetDetails {...instance(mockedProps)} />)
    const searchInput = screen.getByTestId('search')
    fireEvent.change(
      searchInput,
      { target: { value: '*1*' } }
    )
    expect(searchInput).toHaveValue('*1*')
  })

  it('should render delete popup after click remove button', () => {
    render(<SetDetails {...instance(mockedProps)} />)
    fireEvent(
      screen.getAllByTestId(/set-remove-btn/)[0],
      new MouseEvent(
        'click',
        {
          bubbles: true
        }
      )
    )
    expect(screen.getByTestId(/set-remove-btn-member1-icon/)).toBeInTheDocument()
  })
})
