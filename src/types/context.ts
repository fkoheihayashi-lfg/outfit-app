export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';

export type MeetingType = 'casual' | 'work' | 'date' | 'formal' | 'sport';

export type ContextInput = {
  temperature: number; // Celsius
  weather: Weather;
  meetingType: MeetingType;
};
