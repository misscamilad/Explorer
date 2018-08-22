import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BigNumber } from 'bignumber.js';
import moment from 'moment';
import { actions as bountyActions } from 'public-modules/Bounty';
import { actions as fulfillmentActions } from 'public-modules/Fulfillment';
import { actions as reviewActions } from 'public-modules/Review';
import { actions as bountyUIActions } from '../reducer';
import { rootBountyPageSelector } from '../selectors';
import {
  ExtendDeadlineErrorModal,
  ActivateDraftFormModal,
  ExtendDeadlineFormModal,
  ActivateDeadFormModal,
  IncreasePayoutFormModal,
  FulfillBountyFormModal,
  KillBountyFormModal,
  ContributeFormModal,
  TransferOwnershipFormModal,
  IssueRatingFormModal
} from 'containers/Bounty/components';

const ModalManagerComponent = props => {
  const {
    bounty,
    onExtendDeadlineError,
    modalVisible,
    modalType,
    closeModal,
    initiateWalkthrough,

    /* bounty actions */
    activateDraftBountyAction,
    killBountyAction,
    activateBountyAction,
    extendDeadlineAction,
    increasePayoutAction,
    fulfillBountyAction,
    transferOwnershipAction,
    contributeAction
    /*****************/
  } = props;

  if (!modalVisible) {
    return null;
  }

  const minimumBalance = BigNumber(
    bounty.calculated_fulfillmentAmount,
    10
  ).toString();

  const killBounty = () =>
    initiateWalkthrough(() => killBountyAction(bounty.id));

  const activateDraftBounty = values =>
    initiateWalkthrough(() =>
      activateDraftBountyAction({ ...bounty }, values.balance)
    );

  const extendDeadline = values =>
    initiateWalkthrough(() => extendDeadlineAction(bounty.id, values.deadline));

  const transferOwnership = values =>
    initiateWalkthrough(() =>
      transferOwnershipAction(bounty.id, values.newOwner)
    );

  const activateBounty = values =>
    initiateWalkthrough(() =>
      activateBountyAction(
        bounty.id,
        values.balance,
        bounty.paysTokens,
        bounty.tokenDecimals,
        bounty.tokenContract
      )
    );

  const contribute = values =>
    initiateWalkthrough(() =>
      contributeAction(
        bounty.id,
        values.contribution,
        bounty.paysTokens,
        bounty.tokenDecimals,
        bounty.tokenContract
      )
    );

  const increasePayout = values =>
    initiateWalkthrough(() =>
      increasePayoutAction(
        bounty.id,
        values.fulfillmentAmount,
        values.balance,
        bounty.paysTokens,
        bounty.tokenDecimals,
        bounty.tokenContract
      )
    );

  const fulfillBounty = values =>
    initiateWalkthrough(() => fulfillBountyAction(bounty.id, values));

  if (modalType === 'contribute') {
    return <ContributeFormModal onClose={closeModal} onSubmit={contribute} />;
  }

  if (modalType === 'deadlineWarning') {
    return (
      <ExtendDeadlineErrorModal
        onClose={closeModal}
        onExtendDeadline={onExtendDeadlineError}
      />
    );
  }

  if (modalType === 'kill') {
    return <KillBountyFormModal onClose={closeModal} onSubmit={killBounty} />;
  }

  if (modalType === 'activate') {
    return (
      <ActivateDraftFormModal
        onClose={closeModal}
        onSubmit={activateDraftBounty}
        minimumBalance={minimumBalance}
        initialValues={{ balance: minimumBalance }}
      />
    );
  }

  if (modalType === 'extendDeadline') {
    const tomorrow = moment().add(1, 'days');
    const currentDeadline = moment.utc(bounty.deadline);

    const minimumDeadline =
      currentDeadline > tomorrow
        ? currentDeadline.add(1, 'days').local()
        : tomorrow;

    return (
      <ExtendDeadlineFormModal
        onClose={closeModal}
        onSubmit={extendDeadline}
        minimumDeadline={minimumDeadline}
        initialValues={{ deadline: minimumDeadline }}
      />
    );
  }

  if (modalType === 'transferOwnership') {
    return (
      <TransferOwnershipFormModal
        onClose={closeModal}
        onSubmit={transferOwnership}
      />
    );
  }

  if (modalType === 'activateDead') {
    return (
      <ActivateDeadFormModal
        onClose={closeModal}
        onSubmit={activateBounty}
        minimumBalance={minimumBalance}
        initialValues={{ balance: minimumBalance }}
      />
    );
  }

  if (modalType === 'increasePayout') {
    return (
      <IncreasePayoutFormModal
        onClose={closeModal}
        onSubmit={increasePayout}
        minimumPayout={BigNumber(
          bounty.calculated_fulfillmentAmount,
          10
        ).toString()}
        minimumBalance={BigNumber(bounty.calculated_balance, 10).toString()}
      />
    );
  }

  if (modalType === 'fulfillBounty') {
    return (
      <FulfillBountyFormModal onClose={closeModal} onSubmit={fulfillBounty} />
    );
  }

  if (modalType === 'issueRatingForIssuer') {
    return (
      <IssueRatingFormModal
        type="issuer"
        onSubmit={reviewActions}
        onClose={closeModal}
        bounty={bounty}
      />
    );
  }

  if (modalType === 'issueRatingForFulfiller') {
    return (
      <IssueRatingFormModal
        type="fulfiller"
        onSubmit={reviewActions}
        onClose={closeModal}
        bounty={bounty}
      />
    );
  }
};

const mapStateToProps = (state, router) => {
  const bountyPage = rootBountyPageSelector(state);

  return {
    modalType: bountyPage.modalType,
    modalVisible: bountyPage.modalVisible
  };
};

const ModalManager = compose(
  connect(
    mapStateToProps,
    {
      closeModal: bountyUIActions.closeModal,
      showModal: bountyUIActions.showModal,
      activateDraftBountyAction: bountyActions.createBounty,
      killBountyAction: bountyActions.killBounty,
      activateBountyAction: bountyActions.activateBounty,
      extendDeadlineAction: bountyActions.extendDeadline,
      increasePayoutAction: bountyActions.increasePayout,
      fulfillBountyAction: fulfillmentActions.createFulfillment,
      transferOwnershipAction: bountyActions.transferOwnership,
      contributeAction: bountyActions.contribute
    }
  )
)(ModalManagerComponent);

export default ModalManager;
