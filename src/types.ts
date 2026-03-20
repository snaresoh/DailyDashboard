/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyMetric {
  date: string;
  load: number;
  ctl: number;
  atl: number;
  tsb: number;
  acwr: number;
  hrv: number;
  restHr: number;
  sleepScore: number;
  vo2Max: number;
  status: string;
}

export interface Workout {
  date: string;
  time: string;
  duration: string;
  calories: number;
  type: string;
  intensity: string;
}

export interface AppState {
  daily: DailyMetric[];
  workouts: Workout[];
  loading: boolean;
  error: string | null;
}
