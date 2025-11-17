export const EVENT_FIND_BY_CRITERIA_QUERY = `
        query EventsFindByCriteria($input: EventFindByCriteriaRequestDto) {
            eventsFindByCriteria(input: $input) {
            total
            page
            perPage
            totalPages
            items {
                id
                eventType
                aggregateType
                aggregateId
                payload
                timestamp
                createdAt
                updatedAt
            }
            }
        }
        `;

export const EVENT_FIND_BY_ID_QUERY = `
    query EventFindById($id: String!) {
        eventFindById(id: $id) {
            id
            eventType
            aggregateType
            aggregateId
            payload
            timestamp
            createdAt
            updatedAt
        }
    }
`;
