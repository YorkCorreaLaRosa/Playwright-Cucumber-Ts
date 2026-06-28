import { configure, StageCrewMember, Stage } from '@serenity-js/core';
import { DomainEvent, ActivityFinished } from '@serenity-js/core/lib/events';
import { ProblemIndication } from '@serenity-js/core/lib/model';

export const failureTracker = {
  lastFailedActivityId: null as any,
  lastSceneId: null as any,
};

class CustomFailureTracker implements StageCrewMember {
  assignedTo(stage: Stage): StageCrewMember {
    return this;
  }
  notifyOf(event: DomainEvent): void {
    if (event instanceof ActivityFinished && event.outcome instanceof ProblemIndication) {
      failureTracker.lastFailedActivityId = event.activityId;
      failureTracker.lastSceneId = event.sceneId;
    }
  }
}

configure({
  crew: [
    '@serenity-js/console-reporter',
    ['@serenity-js/serenity-bdd', { specDirectory: 'features' }],
    ['@serenity-js/core:ArtifactArchiver', { outputDirectory: 'target/site/serenity' }],
    new CustomFailureTracker(),
  ],
});
