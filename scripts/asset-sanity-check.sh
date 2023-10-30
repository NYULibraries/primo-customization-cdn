#!/bin/sh

base_dir="primo-customization"
view_list=`ls $base_dir/`
template_list="alma-howovp-after prm-login-item-after alma-htgi-back-button-after prm-logo-after alma-htgi-svc-after prm-main-menu-after alma-htgi-tabs-after prm-mendeley-after hls-video-after prm-mendeley-toast-after ng-forward-hack-after prm-messages-and-blocks-after pickup-anywhere-form-after prm-messages-and-blocks-overview-after prm-account-after prm-more-like-this-after prm-account-links-after prm-more-like-this-item-after prm-account-overview-after prm-more-like-this-item-info-after prm-action-container-after prm-multi-select-filter-after prm-action-list-after prm-newspapers-facet-after prm-add-alert-toast-after prm-newspapers-full-view-after prm-add-query-to-saved-searches-after prm-newspapers-home-after prm-additional-services-after prm-newspapers-search-bar-after prm-advanced-search-after prm-newspapers-spotlight-after prm-alma-mashup-after prm-ngrs-brief-result-Line-after prm-alma-more-inst-after prm-ngrs-results-button-after prm-alma-other-members-after prm-no-search-result-after prm-alma-other-units-after prm-offer-details-tile-after prm-alma-representations-filter-after prm-opac-after prm-alma-viewer-after prm-opac-back-button-after prm-alma-viewit-after prm-organization-or-facet-toggle-after prm-alma-viewit-items-after prm-organizations-after prm-alphabet-toolbar-after prm-orglist-categorize-after prm-atoz-search-bar-after prm-page-nav-menu-after prm-authentication-after prm-paging-bar-after prm-back-to-library-search-after prm-pdf-viewer-after prm-back-to-library-search-button-after prm-performance-monitor-after prm-back-to-search-results-button-after prm-permalink-after prm-banner-card-content-after prm-personal-info-after prm-barcode-search-after prm-personal-settings-after prm-blank-ill-after prm-personalization-dialog-after prm-blank-purchase-request-after prm-personalize-results-button-after prm-breadcrumbs-after prm-physical-delivery-more-option-row-after prm-brief-result-after prm-physical-delivery-options-after prm-brief-result-container-after prm-physical-delivery-options-table-after prm-brief-result-delivery-option-link-after prm-popup-message-after prm-brief-result-digital-best-offer-after prm-pre-filters-after prm-brief-result-physical-best-offer-after prm-print-item-after prm-browse-result-after prm-progress-bar-after prm-browse-search-after prm-progress-checkbox-after prm-browse-search-bar-after prm-qr-code-after prm-chapters-and-Reviews-item-after prm-quick-access-after prm-chapters-and-reviews-after prm-quick-link-after prm-chapters-results-line-after prm-rapido-message-bar-after prm-citation-after prm-rapido-no-offer-message-after prm-citation-linker-after prm-recomendation-item-after prm-citation-trails-breadcrumbs-after prm-recomendations-after prm-citation-trails-fullview-link-after prm-record-collection-paths-after prm-citation-trails-indication-after prm-reference-entry-item-after prm-citation-trails-indication-container-after prm-refworks-after prm-citation-trails-item-after prm-report-problem-after prm-collection-after prm-request-after prm-collection-breadcrumbs-after prm-request-approval-after prm-collection-discovery-after prm-request-services-after prm-collection-discovery-view-switcher-after prm-requests-after prm-collection-gallery-after prm-requests-overview-after prm-collection-gallery-header-after prm-requests-services-ovl-after prm-collection-navigation-breadcrumbs-after prm-resource-recommender-after prm-collection-navigation-breadcrumbs-item-after prm-resource-recommender-card-content-after prm-collection-search-after prm-resource-recommender-full-view-after prm-controlled-vocabulary-after prm-resource-type-filter-bar-after prm-copy-clipboard-btn-after prm-reviews-results-line-after prm-copyrights-after prm-save-to-favorites-button-after prm-databases-after prm-saved-queries-after prm-databases-categorize-after prm-saved-queries-list-after prm-databases-full-view-after prm-saved-query-filter-after prm-databases-results-after prm-saved-searches-group-actions-after prm-delivery-registration-after prm-scroll-after prm-delivery-session-expiry-notification-after prm-seadragon-viewer-after prm-denied-access-after prm-search-after prm-deposits-after prm-search-bar-after prm-deposits-link-after prm-search-bookmark-filter-after prm-deposits-overview-after prm-search-error-message-after prm-did-u-mean-after prm-search-explain-after prm-easybib-after prm-search-history-after prm-edit-notification-settings-after prm-search-result-add-to-favorites-menu-after prm-endnote-after prm-search-result-availability-line-after prm-explore-footer-after prm-search-result-frbr-line-after prm-explore-main-after prm-search-result-journal-indication-line-after prm-export-bibtex-after prm-search-result-list-after prm-export-excel-after prm-search-result-sort-by-after prm-export-ris-after prm-search-result-thumbnail-container-after prm-facet-after prm-search-result-title-after prm-facet-exact-after prm-search-result-tool-bar-after prm-facet-range-after prm-search-within-journal-after prm-favorites-after prm-send-email-after prm-favorites-edit-labels-menu-after prm-service-button-after prm-favorites-labels-after prm-service-details-after prm-favorites-record-labels-after prm-service-header-after prm-favorites-tool-bar-after prm-service-links-after prm-favorites-warning-message-after prm-service-ngrs-after prm-featured-result-item-after prm-service-no-offer-found-after prm-featured-results-after prm-service-physical-best-offer-after prm-fines-after prm-services-page-after prm-fines-overview-after prm-share-after prm-full-view-after prm-sign-in-to-view-after prm-full-view-cont-after prm-silent-login-after prm-full-view-page-after prm-silent-login-alert-toast-after prm-full-view-service-container-after prm-skip-to-after prm-gallery-collection-after prm-slider-field-after prm-gallery-collections-list-after prm-snippet-after prm-gallery-item-after prm-social-menu-after prm-gallery-items-list-after prm-source-record-after prm-get-it-request-after prm-stack-map-after prm-icon-after prm-stand-alone-login-after prm-icp-license-footer-after prm-syndetic-unbound-after prm-journals-after prm-tabs-and-scopes-selector-after prm-journals-full-view-after prm-tags-after prm-language-selection-after prm-tags-list-after prm-leganto-after prm-tags-results-after prm-leganto-getit-after prm-tags-search-bar-after prm-libraries-around-bar-after prm-thumbnail-list-after prm-library-after prm-timeout-toast-after prm-library-card-menu-after prm-times-cited-after prm-linked-data-after prm-top-bar-before prm-linked-data-card-after prm-top-nav-bar-links-after prm-linked-user-selector-after prm-topbar-after prm-loan-after prm-tree-nav-after prm-loans-after prm-union-catalog-login-after prm-loans-overview-after prm-union-catalog-login-institution-item-after prm-location-after prm-usage-metrics-after prm-location-holdings-after prm-user-area-after prm-location-item-after prm-user-area-expandable-after prm-location-items-after prm-username-password-login-after prm-locations-after prm-view-online-after prm-login-after prm-virtual-browse-after prm-login-alma-mashup-after prm-virtual-browse-item-after prm-login-help-after prm-virtual-browse-item-info-after prm-login-iframe-after prm-voice-search-toast-after"

for view in $view_list
do
  if ! test -e $base_dir/$view/css/custom.css; then
    echo "Missing custom.css for view '$view'; aborting!"
    exit 1
  fi
  for template in $template_list
  do
    if ! test -e $base_dir/$view/html/$template.html; then
      echo "Missing $template.html for view '$view'; aborting!"
      exit 1
    fi
  done
  echo "Verified existence of custom.css and all html templates for view '$view'"
done
