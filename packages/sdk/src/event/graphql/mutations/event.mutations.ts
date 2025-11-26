export const EVENT_REPLAY_MUTATION = `
    mutation EventReplay($input: EventReplayRequestDto!) {
        eventReplay(input: $input) {
            success
            message
        }
    }
`;
