export interface TranscodeJob {
  trackId: string;
  inputPath: string;
  tmpOutputPath: string;
  outputPath: string;
  sourceKey: string;
  targetKey: string;
}
