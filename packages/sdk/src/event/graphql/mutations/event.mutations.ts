export const EVENT_REPLAY_MUTATION = `
    mutation EventReplay($input: EventReplayInput!) {
        eventReplay(input: $input) {
            success
            message
        }
    }
`;
