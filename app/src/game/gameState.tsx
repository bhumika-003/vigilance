import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { cases, sampleCase, type CaseData } from './cases'

type Outcome = 'sharp' | 'weak' | null

type HistoryEntry = {
  caseId: string
  caseNumber: number
  questionText: string
  confidenceBefore: number
  confidenceAfter: number
  correct: boolean
}

type GameContextValue = {
  caseIndex: number
  currentCase: CaseData
  askedQuestion: string | null
  currentConfidence: number
  history: HistoryEntry[]
  lastOutcome: Outcome
  isResolved: boolean
  submitQuestion: (questionText: string, targetsWeakLink: boolean) => void
  continueToNextCase: () => void
  resetGame: () => void
}

const STORAGE_KEY = 'interrogation-room-state'

const defaultState = {
  caseIndex: 0,
  askedQuestion: null as string | null,
  currentConfidence: sampleCase.startingConfidence,
  history: [] as HistoryEntry[],
  lastOutcome: null as Outcome,
  isResolved: false,
}

async function loadStoredState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultState
    }

    const parsed = JSON.parse(raw) as Partial<typeof defaultState>
    const nextOutcome = parsed.lastOutcome === 'sharp' || parsed.lastOutcome === 'weak' ? parsed.lastOutcome : null

    return {
      ...defaultState,
      ...parsed,
      caseIndex: typeof parsed.caseIndex === 'number' && Number.isFinite(parsed.caseIndex) ? parsed.caseIndex : 0,
      currentConfidence:
        typeof parsed.currentConfidence === 'number' && Number.isFinite(parsed.currentConfidence)
          ? parsed.currentConfidence
          : sampleCase.startingConfidence,
      askedQuestion: typeof parsed.askedQuestion === 'string' ? parsed.askedQuestion : null,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      lastOutcome: nextOutcome,
      isResolved: Boolean(parsed.isResolved),
    }
  } catch {
    return defaultState
  }
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

export function GameProvider({ children }: PropsWithChildren) {
  const [initialState, setInitialState] = useState(defaultState)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeState = async () => {
      const state = await loadStoredState()
      setInitialState(state)
      setIsLoading(false)
    }
    initializeState()
  }, [])

  const [caseIndex, setCaseIndex] = useState<number>(initialState.caseIndex)
  const [askedQuestion, setAskedQuestion] = useState<string | null>(initialState.askedQuestion)
  const [currentConfidence, setCurrentConfidence] = useState<number>(initialState.currentConfidence)
  const [history, setHistory] = useState<HistoryEntry[]>(initialState.history)
  const [lastOutcome, setLastOutcome] = useState<Outcome>(initialState.lastOutcome)
  const [isResolved, setIsResolved] = useState<boolean>(initialState.isResolved)

  const currentCase = useMemo(() => cases[caseIndex] ?? sampleCase, [caseIndex])

  useEffect(() => {
    const payload = {
      caseIndex,
      askedQuestion,
      currentConfidence,
      history,
      lastOutcome,
      isResolved,
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [caseIndex, askedQuestion, currentConfidence, history, lastOutcome, isResolved])

  const submitQuestion = (questionText: string, targetsWeakLink: boolean) => {
    const previousConfidence = currentConfidence
    const resolvedConfidence = targetsWeakLink ? currentCase.resolvedConfidence : Math.max(0, currentCase.startingConfidence - 18)

    setAskedQuestion(questionText)
    setCurrentConfidence(resolvedConfidence)
    setLastOutcome(targetsWeakLink ? 'sharp' : 'weak')
    setIsResolved(true)

    setHistory((prev) => [
      {
        caseId: currentCase.id,
        caseNumber: currentCase.caseNumber,
        questionText,
        confidenceBefore: previousConfidence,
        confidenceAfter: resolvedConfidence,
        correct: targetsWeakLink,
      },
      ...prev,
    ])
  }

  const continueToNextCase = () => {
    const nextIndex = (caseIndex + 1) % cases.length

    setCaseIndex(nextIndex)
    setAskedQuestion(null)
    setCurrentConfidence(cases[nextIndex].startingConfidence)
    setLastOutcome(null)
    setIsResolved(false)
  }

  const resetGame = () => {
    setCaseIndex(0)
    setAskedQuestion(null)
    setCurrentConfidence(sampleCase.startingConfidence)
    setHistory([])
    setLastOutcome(null)
    setIsResolved(false)
  }

  const value = useMemo<GameContextValue>(
    () => ({
      caseIndex,
      currentCase,
      askedQuestion,
      currentConfidence,
      history,
      lastOutcome,
      isResolved,
      submitQuestion,
      continueToNextCase,
      resetGame,
    }),
    [caseIndex, currentCase, askedQuestion, currentConfidence, history, isResolved, lastOutcome],
  )

  if (isLoading) {
    return null
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }

  return context
}
